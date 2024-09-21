import { db } from "../connect.js";
import bcrypt from "bcryptjs"; // pour hasher le mot de passe 
import jwt from "jsonwebtoken"; // pour token 

export const register = (req , res) => {
    //check user if existe 
    const query = "SELECT * FROM users WHERE username = ? ;";
    db.query(query , [req.body.username] , (err , data) => {
        if (err) return res.status(500).json(err);
        if (Object.values(data).length != 0) return res.status(409).send("user already existe !!");
        
        // create new user 
        const salt = bcrypt.genSaltSync(10);
        const hachPassword = bcrypt.hashSync(req.body.password , salt);

        const q= "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?) ;";
        const values = [req.body.username , req.body.email , hachPassword , req.body.name];
        db.query(q , [values] , (err , data)=>{
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been created !");
        });
    });
};

export const login = (req , res) => {
    // check username if existe 
    const query = "SELECT * FROM users WHERE username = ? ;";
    db.query(query , [req.body.username] , (err , data) => {
        if (err) return res.status(500).json(err);
        if (Object.values(data).length == 0) return res.status(409).send("user not found !!");
    
    
        const checkPassword = bcrypt.compareSync(req.body.password , data[0].password);
        if(!checkPassword) return res.status(400).json("Wrong password"); 

        const token = jwt.sign({id:data[0].id},"secretKey");
        const { password , ...others } = data[0];
        res.cookie("accessToken",token ,{
            httpOnly:true,
            sameSite: 'None',
            secure: true 
        }).status(200).json(others);

    });
};

export const logout = (req, res) => {
    res.clearCookie("accessToken",{
      secure:true,
      sameSite: "none", 
    }).status(200).json("User has been logged out.")
  };