# api/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.course_id = self.scope["url_route"]["kwargs"]["course_id"]
        self.room_group_name = f"chat_course_{self.course_id}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        # data should look like: { "sender", "role", "time", "text" }

        # Broadcast the entire payload to everyone in the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "sender": data.get("sender"),
                "role": data.get("role"),
                "time": data.get("time"),
                "text": data.get("text"),
            },
        )

    async def chat_message(self, event):
        # Now 'event' has the keys: sender, role, time, text
        await self.send(text_data=json.dumps({
            "sender": event["sender"],
            "role": event["role"],
            "time": event["time"],
            "text": event["text"],
        }))
