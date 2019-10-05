const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://andrew:vqr712XVBrOkyuLc@started-from-a-golf-pool-jglop.mongodb.net/golfPool', { useNewUrlParser: true });
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    first_name: String,
    last_name: String,
    tournaments: [{ tournament_id: String, name: String, start_date: String, picks: [{ id: String, first_name: String, last_name: String, country: String, }] }]
});

module.exports = mongoose.model('User', UserSchema);
