const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const robot = require('robotjs'); // Import RobotJS
const path = require('path');

const app = express();
const PORT = 3000;

const baseUrl = '192.168.0.101';
// const baseUrl = 'https://plain-yaks-march.loca.lt';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// Endpoint to receive key press requests
app.post(`/press-key`, (req, res) => {
    const key = req.body.key;
    console.log(`Attempting to press key: ${key}`);

    try {
        // Use RobotJS to press the key
        robot.keyTap(key);
        console.log(`Successfully pressed key: ${key}`);
        res.send(`Successfully pressed key: ${key}`);
    } catch (error) {
        console.error(`Error pressing key '${key}':`, error);
        return res.status(500).send(`Error pressing key '${key}': ${error.message}`);
    }
});

app.post(`/press-key-combo`, (req, res) => {
    const key = req.body.key;
    console.log(`Attempting to press key combo: ${key}`);

    try {
        // Use RobotJS to press the key
        robot.keyToggle("command","down");
            robot.keyTap("l");
        robot.keyToggle("command","up");
        console.log(`Successfully pressed key combo: ${key}`);
        res.send(`Successfully pressed key combo: ${key[0]} ${key[1]}`);
    } catch (error) {
        console.error(`Error pressing key combo ' ${key[0]} ${key[1]} ':`, error);
        return res.status(500).send(`Error pressing key combo '${key}': ${error.message}`);
    }
});

app.post(`/hold-key`, (req, res) => {
    const key = req.body.key;
    console.log(`Attempting to hold key: ${key}`);

    try {
        // Use RobotJS to press the key
        robot.keyToggle(key,'down');
        console.log(`Holding key: ${key}`);
        res.send(`Holding key: ${key}`);
    } catch (error) {
        console.error(`Error holding key '${key}':`, error);
        return res.status(500).send(`Error holding key '${key}': ${error.message}`);
    }
});

app.post(`/release-key`, (req, res) => {
    const key = req.body.key;
    console.log(`Attempting to release key: ${key}`);

    try {
        // Use RobotJS to press the key
        robot.keyToggle(key,'up');
        console.log(`Released key: ${key}`);
        res.send(`Released key: ${key}`);
    } catch (error) {
        console.error(`Error releasing key '${key}':`, error);
        return res.status(500).send(`Error releasing key '${key}': ${error.message}`);
    }
});

app.post('/tap',(req,res)=>{
    const tapObj = req.body.tapObj;
    const {x,y} = robot.getMousePos();
    console.log("Attempting to tap at: ", robot.getMousePos());
    try{
        robot.mouseClick();
        console.log("Tapped at: ", {x,y});
        res.status(200).json({ message: "Tap received successfully" });
    } catch(error){
        console.log("Error for tap: ", error);
        res.status(500).json({ error: "Error processing tap", details: error.message });
    }
})

app.post(`/move-cursor`, (req, res) => {
    const cursorObj = req.body.cursorObj;
    console.log(`Attempting to move cursor:${cursorObj.directionX},${cursorObj.directionY}`);

    try {
        // Use RobotJS to press the key
        let currentPos = robot.getMousePos();
        // switch (cursorObj.directionX) {
        //     case 'left':
        //         offsetX = -10;
        //         break;
        //     case 'right':
        //         offsetX = 10;
        //         break;
        //     case 'none':
        //         offsetX = 0;
        //         break;
        // }
        // switch(cursorObj.directionY){
        //     case 'up':
        //         offsetY = -10;
        //         break;
        //     case 'down':
        //         offsetY = 10;
        //         break;
        //         case 'none':
        //         offsetY = 0;
        //         break;
        // }

        let speed = 3;
        let newX = currentPos.x + speed*cursorObj.offsetX;
        let newY =  currentPos.y + speed*cursorObj.offsetY;
        robot.moveMouse(newX,newY);
        console.log(`Moved mouse cursor ${cursorObj.directionX},${cursorObj.directionY}`);
        res.send(`Moved mouse cursor ${cursorObj.directionX},${cursorObj.directionY}`);
    } catch (error) {
        console.error(`Error moving mouse cursor: `, error);
        return res.status(500).send(`Error moving mouse cursor: ${error.message}`);
    }
});

app.post('/scroll', (req, res) => {
    const { scrollDistance } = req.body;

    // Adjust the scroll scale factor to increase/decrease scroll speed
    const scrollScale = 5;
    const scrollAmount = scrollDistance * scrollScale;

    // Scroll vertically on the PC
    console.log('scroll amount: ', scrollAmount);

    // let scrollTimes = 10;
    // let scrollIteration = 0;
    
        if(scrollAmount > 0){
            robot.keyTap('up');
        } else {

            robot.keyTap('down');
        }
        // scrollIteration++;
        // if(scrollIteration === scrollTimes){
        //     scrollIteration = 0;
        //     clearInterval(scrollInterval);
        // }
    
        
        // robot.mouseClick();
    
    res.json({success:true})
});

app.post('/', (req, res) => {
    // res.json({ baseUrl:  process.env.PUBLIC_URL});
    res.json({baseUrl});
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at ${baseUrl}:${PORT}`);
});