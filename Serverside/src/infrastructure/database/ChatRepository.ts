import { IChatRepository } from '../../domain/repositories/IChatRepository';
import { Chat, Message, Participant } from '../../domain/models/Chat';
import ChatModel from './modals/ChatSchema'; // MongoDB Schema
import { AuthError } from '../../domain/errors/Autherror';
import { ObjectId } from 'mongodb';
import { injectable } from 'tsyringe';
import { Types } from 'mongoose';
@injectable()
export class MongoChatRepository implements IChatRepository {
  async findChatByBookingId(bookingId: string): Promise<Chat | null> {
  try{
    return await ChatModel.findOne({ bookingId }).lean() as Chat | null;
  }
catch(error:any){       

    console.error("Error finding chat by booking ID:", error.message);
    throw new AuthError("Failed to find chat by booking ID", 500);
}
   
  }

  async createChat(chat: Chat): Promise<Chat> {
    try{
     
        const newChat = await ChatModel.create(chat);
 
        return newChat.toObject() as Chat;
    }catch(error:any){

        console.error("Error creating chat:", error.message);
        throw new AuthError("Failed to create chat", 500);
    }
  
  }

  async addMessageToChat(
    bookingId: string,
    message: Message
  ): Promise<Chat | null> {
    
    const updatedChat = await ChatModel.findOneAndUpdate(
      { bookingId },
      { $push: { messages: message } },
      { new: true }
    )

    return updatedChat ? { ...updatedChat.toObject(), _id: updatedChat._id as ObjectId } : null;
  }
  async findMessagesByBookingId(bookingId: string): Promise<Message[]> {
    const chat = await ChatModel.findOne({ bookingId })
      .select('messages')
      .lean();
  
    if (!chat) {
      return [];
    }
  
    return chat.messages;
  }
  async addParticipant(chatId: string, participant: Participant): Promise<void> {
   try{
    await ChatModel.updateOne(
      { _id: chatId },
      { $push: { participants: participant } }
    );
   }catch(error:any){ 
    
    console.error("Error adding participant:", error.message);
    throw new AuthError("Failed to add participant", 500);
   }  

  }
  async findById(chatId: string): Promise<Chat | null> {

    try{
      if (!Types.ObjectId.isValid(chatId)) {
        return null;
      }
    
      const chat = await ChatModel.findById(chatId).lean();
      if (!chat) return null;
    
      return {
        ...chat,
        _id: chat._id as Types.ObjectId,
      } as Chat;
    }catch(error:any){    
        
        console.error("Error finding chat by ID:", error.message);
        throw new AuthError("Failed to find chat by ID", 500);
      }
    
  }
}
