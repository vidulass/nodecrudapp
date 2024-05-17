const axios = require('axios');

exports.homeRoutes = async (req, res) => {
    try {
        // Make a get request to /api/users
        const response = await axios.get('http://localhost:3000/api/users');
        res.render('index', { users: response.data });
    } catch (error) {
        // Log the error details for debugging
        console.error('Error fetching users:', error.message);

        // Check if the error is an Axios error
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
            res.status(error.response.status).send('Error fetching users: ' + error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            res.status(500).send('No response received from the server.');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
            res.status(500).send('Error setting up request: ' + error.message);
        }
    }
};


exports.add_user = (req,res)=>{
    res.render('add_user');
}


exports.update_user = (req,res)=>{
    axios.get('http://localhost:3000/api/users',{params:{id:req.query.id}})
        .then(function(userdata){
            res.render("update_user",{user:userdata.data})
        })
        .catch(err =>{
            res.send(err);
        })
}

exports.search_user = (req, res) => {
    axios.get(`http://localhost:3000/api/users`,{params:{name:req.query.name}})
        .then(function (userdata) {
            res.render("search_user", { users: userdata.data });
        })
        .catch(err => {
            res.send(err);
        });
};