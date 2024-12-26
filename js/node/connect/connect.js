 export default async function connect(data,port) {
    try {
      const response = await fetch('http://localhost:'+port, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('CmdServer:Local response was not ok');
      }
      const data = await response.json();
      console.log('CmdServerResponse:', data);
      return data;
    } catch (error) {
      console.error('CmdServer:Error:', error);
      return false;
    }
  }