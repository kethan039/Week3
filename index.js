const express=require("express");
const jwt=require("jsonwebtoken");
const app=express();
const password="nndndndoowiw";
let admins=[];
let users=[];
let courses=[];
app.use(express.json());
const adminauth=(req,res,next)=>{
    const {username,password}=req.headers;
    const admin=admins.find(a=> a.username==username && a.password==password);
    if(admin){
        next();
    }
    else{
        res.status(403).json({message:'Admin auth failed'});
    }
};
const userauth=(req,res,next)=>{
    const {username,password}=req.headers;
    const user=users.find(u=> u.username==username && u.password==password);
    if(user){
        req.use=user;
        next();

    }else{
        res.status(403).json({message:'user auth failed'});
    }
}
app.post('/admin/signup',(req,res)=>{
    const admin=req.body;
    const existingadmin=admins.find(a=>a.username==admin.username);
    if(existingadmin){
        res.status(403).json({message:"Admin already exists"});
    }
    else{
        admins.push(admin);
        res.json({message:"Admin created"});
    }
});
app.post('/admin/login',adminauth,(req,res)=>{
    res.json({message:"Admin Logged in"})
})
app.post('/admin/courses',adminauth,(req,res)=>{
    const course=req.body;
    course.id=Date.now();
    courses.push(course);
    res.json({message:"Course created", id:course.id});
})
app.put('/admin/courses/:courseId',adminauth,(req,res)=>{
    const courseId=parseInt(req.params.courseId);
    const course= courses.find(c=> c.id==courseId);
    if(course){
        Object.assign(course,req.body);
        res.json({message:"updated"});
    }else{
        res.status(404).json({message:"course not found"});
    }
});
app.post('/users/signup',(req,res)=>{
    const user=req.body;
    const existinguser=users.find(u=>u.username==user.username)
    if(existinguser){
        res.status(403).json({message:"User already exists"});
    }
    else{
        users.push(user);
        res.json({message:"user signed up"});
    }
})
app.post('/users/login',userauth,(req,res)=>{
    res.json({message:"user loggedin"});
})
app.get('/users/courses',userauth,(req,res)=>{
    let filteredcouse=[];
    for(let i=0; i<courses.length;i++){
        if(courses[i].published){
            filteredcouse.push(courses[i]);
        }
    }
    res.json({courses:filteredcouse});
    
});
app.post('/users/courses/:courseId',userauth,(req,res)=>{
    const courseId=parseInt(req.params.courseId);
    const course=courses.find(c=>c.id===courseId && c.published);
    if(course){
        req.user.purchasedCourses.push(courseId);
        res.json({message:"Course purchased succesfully"});
    }
    else{
        res.status(404).json({message:"Not available"});
    }
});


app.listen(3000,()=>{
    console.log("Listening...");
});

