import AWS from 'aws-sdk';

// Initialize S3
const s3 = new AWS.S3();

export const handler = async (event) => {
    try {
        const { httpMethod, path, queryStringParameters, body, isBase64Encoded } = event;
        const bucketName = 'my-simple-app-files';
        const basePath = '/Prod/hello';

        // Check if 'action' query parameter is set
        const action = queryStringParameters?.action;
        const pass = queryStringParameters?.pass;

        if (httpMethod === 'POST' && action === 'upload' && pass === 'Y0#88Zs9]5Lt') {
            return await uploadFile(event, bucketName, body, isBase64Encoded);
        }

        if (httpMethod === 'GET' && action === 'list') {
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

const uploadFile = async (event, bucketName, body, isBase64Encoded) => {
    // If the file data is base64-encoded, decode it
    let fileContent = isBase64Encoded ? Buffer.from(body, 'base64') : body;
    
    // File name extraction
    const fileName = event.headers['file-name'] || 'default.txt';  // You can pass the file name in headers or as part of the form

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
    };

    try {
        const data = await s3.upload(params).promise();
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully!', data })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error uploading file', error: error.message })
        };
    }
};

const listFiles = async (bucketName) => {
    const params = { Bucket: bucketName };
    const data = await s3.listObjectsV2(params).promise();
    
    return {
        statusCode: 200,
        body: JSON.stringify({ files: data.Contents })
    };
};
