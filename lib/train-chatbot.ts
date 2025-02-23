import { supabase } from './supabase';

interface TrainingMessage {
  role: 'assistant' | 'user';
  content: string;
}

interface TrainingSession {
  sessionId: string;
  messages: TrainingMessage[];
}

class ChatbotTrainer {
  private batchSize: number;
  private minMessagesPerSession: number;

  constructor(batchSize = 32, minMessagesPerSession = 2) {
    this.batchSize = batchSize;
    this.minMessagesPerSession = minMessagesPerSession;
  }

  async fetchTrainingData(lastTrainedAt?: Date): Promise<TrainingSession[]> {
    try {
      // Fetch chat sessions that haven't been trained yet
      const query = supabase
        .from('chat_history')
        .select('session_id, role, content, created_at')
        .order('created_at', { ascending: true });

      if (lastTrainedAt) {
        query.gt('created_at', lastTrainedAt.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      // Group messages by session
      const sessionMap = new Map<string, TrainingMessage[]>();
      
      data.forEach((msg: any) => {
        if (!sessionMap.has(msg.session_id)) {
          sessionMap.set(msg.session_id, []);
        }
        sessionMap.get(msg.session_id)?.push({
          role: msg.role,
          content: msg.content
        });
      });

      // Convert to array and filter sessions with enough messages
      const trainingSessions: TrainingSession[] = [];
      
      sessionMap.forEach((messages, sessionId) => {
        if (messages.length >= this.minMessagesPerSession) {
          trainingSessions.push({
            sessionId,
            messages
          });
        }
      });

      return trainingSessions;
    } catch (error) {
      console.error('Error fetching training data:', error);
      throw error;
    }
  }

  async processTrainingBatch(sessions: TrainingSession[]) {
    try {
      // Process sessions in batches
      for (let i = 0; i < sessions.length; i += this.batchSize) {
        const batch = sessions.slice(i, i + this.batchSize);
        await this.trainOnBatch(batch);
      }

      // Update last trained timestamp
      const timestamp = new Date();
      await this.updateTrainingTimestamp(timestamp);

      console.log(`Training completed at ${timestamp}`);
    } catch (error) {
      console.error('Error processing training batch:', error);
      throw error;
    }
  }

  private async trainOnBatch(batch: TrainingSession[]) {
    // TODO: Implement actual model training logic here
    // This would involve:
    // 1. Converting messages to training format
    // 2. Calling model training API
    // 3. Updating model weights
    console.log(`Training on batch of ${batch.length} sessions`);
  }

  private async updateTrainingTimestamp(timestamp: Date) {
    try {
      const { error } = await supabase
        .from('training_metadata')
        .upsert({
          id: 'last_trained',
          timestamp: timestamp.toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating training timestamp:', error);
      throw error;
    }
  }

  async startTraining() {
    try {
      // Get last training timestamp
      const { data, error } = await supabase
        .from('training_metadata')
        .select('timestamp')
        .eq('id', 'last_trained')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      const lastTrainedAt = data?.timestamp ? new Date(data.timestamp) : undefined;
      
      // Fetch and process new training data
      const sessions = await this.fetchTrainingData(lastTrainedAt);
      
      if (sessions.length > 0) {
        await this.processTrainingBatch(sessions);
        console.log(`Trained on ${sessions.length} new sessions`);
      } else {
        console.log('No new sessions to train on');
      }
    } catch (error) {
      console.error('Error during training:', error);
      throw error;
    }
  }
}

export const chatbotTrainer = new ChatbotTrainer();