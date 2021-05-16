const express = require("express");
const app = express();
const port = 5050;

//set up mongoose
const mongoose = require("mongoose");
const connectionString = "mongodb://localhost:27017/NOR-APP";
app.use(express.json());

mongoose.connect(
    connectionString,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Data base Connected successfully")
        }
    }
)

//create schema
const individualSchema = new mongoose.Schema({
    name: String,
    email: String,
    state: String,
    occupation: String,
    age: Number,
});

const Individuals = mongoose.model("Individuals", individualSchema);

//POST request to /register to register a new individual
app.post("/register", function (req, res) {
    //retrieve new individual's details from req.body

Individuals.create(
        {   name:req.body.name,
            email: req.body.email,
            state: req.body.state,
            occupation: req.body.occupation,
            age: req.body.age,
        },(err, newIndividual) => {
            if (err) {
                return res.status(500).json({ message: err })
            } else {return res.status(200).json({ message: "New individual registered", newIndividual })
            }
        }
    );
    //register a new individual and add to the db
    //sends a message to client
});
//GET request to /indivuals to fetch all registered individuals
app.get("/register", (req, res) => {
    //fetch all individuals
    Individuals.find({}, (err, register) => {
        if (err) {return res.status(500).json({ message: err });
        } else {return res.status(200).json({ register });
        }
    });
});
//GET request to /indivuals:id to fetch a single registered individual
app.get("/register/:id", (req, res) => {
    Individuals.findById(req.params.id, (err, individual) => {
        if (err) {
            return res.status(500).json({ message: err });
        } else if (!individual) {
            return res.status(404).json({ message: "Individual not found" });
        } else {
            return res.status(200).json({ individual });
        }
    });
});
//PUT request to update a single individual's details 
app.put("/register/:id", (req, res) => {
    Individuals.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            state: req.body.state,
            occupation: req.body.occupation,
            age: req.body.age,
        },
        (err, individual) => {
            if (err) {
                return res.status(500).json({ message: err });
            } else if (!individual) {
                return res.status(404).json({ message: "Individual Not Found" });
            } else {
                individual.save((err, savedIndvidual) => {
                    if (err) {
                        return res.status(400).json({ message: err });
                    } else {
                        return res.status(200).json({
                            message: "Register Updated Successfully"
                        });
                    }
                });
            }
        }
    );
});
//DELETE request to /indivuals:id to delete a registered individuals details
app.delete("/register/:id", (req, res) => {
    Individuals.findByIdAndDelete(req.params.id, (err, individual) => {
        if (err) {
            return res.status(500).json({ message: err })
        } else if (!individual) {
            return res.status(404).json({ message: "Individual Was not found" })
        } else {
            return res.status(200).json({ message: "Individual deleted successfully" })
        }
    });
});


app.listen(port, () => console.log(`app listening on port ${port}`));
