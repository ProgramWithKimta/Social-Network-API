import { Schema, Types, model, type Document } from 'mongoose';

interface IReaction {
  reactionBody: String;
  username: String;
  createdAt: Date;
}

interface IThought extends Document {
    thoughtText: string,
    createdAt: Date,
    username: string,
    reactions: IReaction[];
    reactionCount?: Number,
}

// Reaction SchemaONLY
const reactionSchema = new Schema(
    {
      reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
      },
      reactionBody: {
        type: String,
        required: true,
        maxLength: 280
      },
      username: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now,
      }
    },
    {
      toJSON: {
        getters: true
      },
      _id: false // Prevents creation of its own _id field
    }
  );
  
  // Thought Schema Model
  const thoughtSchema = new Schema<IThought>(
    {
      thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 280
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      username: {
        type: String,
        required: true
      },
      reactions: [reactionSchema]
    },
    {
      toJSON: {
        virtuals: true,
        getters: true
      },
      id: false
    }
  );
  
  // Virtual to get total number of reactions
  thoughtSchema.virtual('reactionCount').get(function (this: IThought) {
    return this.reactions.length;
  });

const Thought = model<IThought>('Thought', thoughtSchema);

export default Thought;
