// index.js

export const handler = async (event) => {
    // You can log the event to inspect it, if necessary.
    console.log("Received event:", JSON.stringify(event, null, 2));
  
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "Hello, World!",
      }),
    };
  
    return response;
  };
  