import asyncio
import json
import websockets

async def test_websocket():
    uri = "ws://localhost:8000/ws/chat/testcourse/"
    async with websockets.connect(uri) as websocket:
        await websocket.send(json.dumps({"message": "Hello from Python!"}))
        print("Message sent")
        response = await websocket.recv()
        print("Received:", response)

asyncio.run(test_websocket())
