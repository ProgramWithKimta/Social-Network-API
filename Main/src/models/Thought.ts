import { Schema, Types, model, type Document } from 'mongoose';
import moment from 'moment';

interface IThought extends Document {
    thoughtText: string,
    createdAt: Date,
    username: string,
    reactions: Date,
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
        get: (timestamp: Date) => moment(timestamp).format('MMM Do, YYYY [at] h:mm A')
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
  const thoughtSchema = new Schema(
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
        get: (timestamp: Date) => moment(timestamp).format('MMM Do, YYYY [at] h:mm A')
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
  thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
  });

const Thought = model<IThought>('Thought', thoughtSchema);

export default Thought;
