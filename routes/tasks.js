var express = require('express');
var router = express.Router();

/*
 * GET /tasks/all
 */
router.get('/all', function(req, res) {
    var db = req.db;
    db.collection('taskCollection').find().toArray( function (err, items) {
        res.json(items);
    });
});

/*
 * GET /tasks/date/:date
 */
router.get('/date/:date', function(req, res) {
    var db = req.db;
	var dayStart = new Date(req.params.date);
	var dayEnd = new Date(req.params.date)
	dayEnd = dayEnd.setHours(24,59,59,999);
	
	dayStart = new Date(dayStart).toISOString().slice(0, 19).replace('T', ' ');
	dayEnd = new Date(dayEnd).toISOString().slice(0, 19).replace('T', ' ');
	
	/*
		Task Collection
		Handled by taking either of the 3 conditions below:
		- Find all tasks that start after Today's Start Time AND tasks that start before Today's End
		- Find all tasks that end after Today's Start Time AND tasks that end before Today's End
		- Find all tasks that start before Today's Start Time AND tasks that end after Today's End
	*/
	db.collection('taskCollection').find({$or: [{$and: [ { dateStart: { $gt: dayStart } }, { dateStart: { $lt: dayEnd } } ]}, {$and: [ { dateEnd: { $gt: dayStart } }, { dateEnd: { $lt: dayEnd } } ]}, {$and: [ { dateStart: { $lt: dayStart } }, { dateEnd: { $gt: dayEnd } } ]}]}).toArray( function (err, items) {
        res.json(items);
    });
});

/*
 * GET /tasks/id/:id
 */
router.get('/id/:id', function(req, res) {
    var db = req.db;
	db.collection('taskCollection').findById(req.params.id, function (err, items) {
        res.json(items);
    });
});

/*
 * POST to /tasks/new.
 */
router.post('/new', function(req, res) {
	if(!req.body) { return res.send(400); } // 6
    var db = req.db;
	db.collection('taskCollection').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to tasks/:id.
 */
router.delete('/:id', function(req, res) {
    var db = req.db;
    var taskToDelete = req.params.id;
    db.collection('taskCollection').removeById(taskToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/*
 * PUT to /tasks/:id.
 */
router.put('/:id', function(req, res) {
	
    var db = req.db;
	if(!req.body) { return res.send(400); } 
	 db.collection('taskCollection').findById(req.body._id, function(err, result){
		 
		if(err) { return res.send(500, err); }
		if(!result) { return res.send(404); }
		
		var data = {};
		if (req.body.title) {
			data.title = req.body.title;
		}
		 if (req.body.deadline) {
			data.deadline = req.body.deadline;
		}
        if (req.body.description) {
			data.description = req.body.description;
		}
		if (req.body.dateStart) {
			data.dateStart = req.body.dateStart;
		}
		if (req.body.dateEnd) {
			data.dateEnd = req.body.dateEnd;
		}
		if (req.body.location) {
			data.location = req.body.location;
		}
         console.log(req.params.id, data);

		db.collection('taskCollection').updateById(req.params.id, 
		{$set: data},
		function(errUpd) { 
			if(errUpd) {
                return res.send(500, errUpd);
            }
            res.send(result);
		});
    });
	
});

module.exports = router;
