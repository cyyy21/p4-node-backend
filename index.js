import express from 'express';
import process from 'node:process';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import Destination from './Destination.js';


const app = express();
const PORT = process.env.PORT || 3000;


app.set('port', PORT);

// Add your middleware
// app.use(express.json());
app.use(cors({
  origin:'http://localhost:5173'
}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World!',
  });
});

await mongoose.connect('\mongodb://127.0.0.1:27017/destination');

app.get('/destination', async (req,res)=> {

  const destination = await Destination.find({isDeleted:false})
  res.status(200).json({
    data:destination
  })

});
//get the deletedPlace 
app.get('/destination/deletedplace',  async (req,res) => {
 
    const deletedPlace = await Destination.find({isDeleted:true})
    res.status(200).json({
      data:deletedPlace
    })


})



app.post('/destination', async (req,res)=> {
  const {place,image,description} = req.body
 
const newPlace = await new Destination({
  place,
  image,
  description
})

await newPlace.save()

res.status(201).json({
  message:'Success,New place added!',
  data :newPlace

})
})

//SOFT DELETION
app.put('/delete/:id',  async (req,res)=>{
  const { id } = req.params;
  const deletePlace = await Destination.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true } // to return the updated document
  );

  res.status(200).json({
    delete:deletePlace,
    message:'place has been deleted'
  })
})

//EDIT 
app.put('/destination/:id', async (req, res) => {
  const { id } = req.params;
  const { place, image, description } = req.body;

  const updatePlace = await Destination.findByIdAndUpdate(
    id,
    { place, image, description },
    { new: true }
  );

  if (!updatePlace) {
    return res.status(404).json({
      message: "No such destination found",
    });
  }

  res.status(200).json({
    message: "Place has been updated",
  });
});






app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
