import AWS from 'aws-sdk';

// Initialize S3
const s3 = new AWS.S3();

export const handler = async (event) => {
    try {
        const { httpMethod, path, queryStringParameters } = event;
        const bucketName = 'my-simple-app-files';
        const basePath = '/Prod/hello';

        // Check if 'action' query parameter is set
        const action = queryStringParameters?.action;

        if (httpMethod === 'POST' && path === basePath && action === 'upload') {
            return await uploadFile(event, bucketName);
        }

        if (httpMethod === 'GET' && path === basePath && action === 'list') {
            return await listFiles(bucketName);
        }

        // Return 404 for any unrecognized route or missing action
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Route not found or missing action' }),
        };
        
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
