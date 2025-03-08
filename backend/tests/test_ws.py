import asyncio
import json
from channels.testing import WebsocketCommunicator
from django.test import TransactionTestCase
from backend.asgi import application  # Adjust the import if your asgi.py is located elsewhere

class ChatConsumerTest(TransactionTestCase):
    async def test_chat_communication(self):
        # Create a communicator instance, connecting to the chat endpoint for a test course.
        communicator = WebsocketCommunicator(application, "/ws/chat/testcourse/")
        connected, subprotocol = await communicator.connect()
        self.assertTrue(connected)

        # Prepare a message to send.
        test_message = {
            "sender": "TestUser",
            "role": "student",
            "time": "2023-01-01T00:00:00Z",
            "text": "Hello from Python!"
        }
        # Send the message as JSON.
        await communicator.send_json_to(test_message)

        # Receive the broadcast message.
        response = await communicator.receive_json_from()
        # Check that the received message matches what was sent.
        self.assertEqual(response["text"], test_message["text"])
        self.assertEqual(response["sender"], test_message["sender"])
        self.assertEqual(response["role"], test_message["role"])
        self.assertEqual(response["time"], test_message["time"])

        # Disconnect the communicator.
        await communicator.disconnect()

    # Helper to run asynchronous tests in a synchronous context.
    def test_chat(self):
        asyncio.get_event_loop().run_until_complete(self.test_chat_communication())
