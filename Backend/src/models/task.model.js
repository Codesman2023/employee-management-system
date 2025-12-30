const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'in-progress', 'under-review', 'completed', 'failed'],
    default: 'pending'
  },

  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },

  dueDate: {
    type: Date,
    required: true
  },

  category: {
    type: String,
    required: true,
    trim: true
  },

  completedAt: {
    type: Date
  },

  // ⭐ NEW — Links Admin or Employee can add
  links: [
    {
      url: String,
      addedBy: {
        type: String,
        enum: ["admin", "employee"]
      },
      addedAt: { type: Date, default: Date.now }
    }
  ]

}, { timestamps: true });

// Auto add completedAt
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed') {
    this.completedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
