import e from "express";
import axios from "axios";

const app = e();
const port = 3000;
const BaseURL = "https://api.geoapify.com/v1/geocode/search";
const API_KEY = "c067286dd59744648c344e12b7c4991d";

app.use(e.urlencoded({extended:true}));
app.use(e.static("public"));

var data;

app.get("/", (req,res)=>{
    res.render("index.ejs")
})

app.post("/",(req,res)=>{
    res.redirect("/")
})

app.post("/submit", async(req,res)=>{
    let fName = req.body["name"];
    let fCity = req.body["city"];
    let fState = req.body["state"];
    let fCountry = req.body["country"];
    try {
        let response = await axios.get(BaseURL,{
            params:{
                name:fName,
                city:fCity,
                state:fState,
                country:fCountry,
                apiKey:API_KEY
            }
        });
        let lat = response.data.features[0].properties.lat;
        let lon = response.data.features[0].properties.lon;
        let uvIndex;
        try {
            let uv = await axios.get(`https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`,{
                headers:{
                    "Content-Type":"application/json",
                    "x-access-token":"openuv-olgrrlo2tr4g9-io",
                }
            });
            uvIndex=uv.data.result.uv;
        } catch (error) {
            console.log(error.message + " UV_API");
        }

        data = {
            lat:lat,
            lon:lon,
            uvIndex:uvIndex,
            imgSrc:`https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${lon},${lat}&marker=lonlat:${lon},${lat};color:%23ff0000;size:medium&zoom=12&apiKey=${API_KEY}`
        }
        
        res.render("index.ejs",data);
        
    } catch (error) {

        console.log(error.message + " geoapify");
        
    }
})

app.get("/submit",(req,res)=>{
    res.render("index.ejs");
})

app.listen(port,()=>{
    console.log(`Listening to PORT:${port}`);
})