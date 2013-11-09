var questions = function() {
    var questionSchema = mongoose.Schema({
        query: String,
        date: { type: Date, default: Date.now },
        questionLoc: { type: [Number], index: '2dsphere' },
        askedLoc: { type: [Number], index: '2dsphere' },
        answeredDistance: Number, // Distance in m from question location that answerer can be
        expires: Date,
        meta: {
            votes: { type: Number, default: 0 },
            favs: { type: Number, default: 0 },
            tags: { type: Array, default: [] },
        },
        answers: [{
            body: String,
            date: { type: Date, default: Date.now },
            answeredLoc: { type: [Number], index: '2dsphere' },
            meta: {
                votes: { type: Number, default: 0 },
                favs: { type: Number, default: 0 },
            }
        }],
    });

    questionSchema.methods.answer = function (body, loc) {
        this.answers.push({
            body: body,
            answeredLoc: loc
        });
        console.log('answered');
    }

    var Question = mongoose.model('Question', questionSchema);

    var lunch = new Question({
        query: 'How long is the line at Burger Priest?',
        questionLoc: [43.646036 , -79.409782],
        askedLoc: [43.646228, -79.391853],
        answeredDistance: 5,
        expires: Date.now() + (60*60*1000)
    });
    lunch.meta.votes++;
    lunch.meta.favs++;
    lunch.meta.tags.push('lunch');
    lunch.meta.tags.push('food');

    lunch.answer('Short. Come have a burger!', [43.646036 , -79.409782])

    console.log(lunch);

    lunch.save(function (err, lunch) {
          if (err) // TODO handle the error
          console.log('saved');
    });

    Question.find(function (err, questions) {
        if (err) // TODO handle err
        console.log(questions)
    });
}

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pandamonium');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', questions);

