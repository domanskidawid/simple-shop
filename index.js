import AWS from 'aws-sdk';

// Initialize S3
const s3 = new AWS.S3();

export const handler = async (event) => {
    try {
        const { httpMethod, path } = event;
        const bucketName = 'my-simple-app-files';
        
        if (httpMethod === 'POST' && path === '/upload') {
            return await uploadFile(event, bucketName);
        } else if (httpMethod === 'GET' && path === '/list') {
            return await listFiles(bucketName);
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Route not found' }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error processing request', error: error.message }),
        };
    }
};

const uploadFile = async (event, bucketName) => {
    const fileName = event.fileName || 'default.txt';
    const fileContent = event.fileContent || 'Hello, S3!';
    
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
    };
    
    const data = await s3.upload(params).promise();
    
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'File uploaded successfully!', data })
    };
};

const listFiles = async (bucketName) => {
    const params = { Bucket: bucketName };
    const data = await s3.listObjectsV2(params).promise();
    
    return {
        statusCode: 200,
        body: JSON.stringify({ files: data.Contents })
    };
};