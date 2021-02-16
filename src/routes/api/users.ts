const router = require('express-promise-router')()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require("bcryptjs")
const prisma = new PrismaClient()
import { Request, Response, NextFunction } from 'express'
import { HttpException } from '../../utils/HttpException'
// import { HttpException } from './utils/HttpException'


//creating User
router.post("/", async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    addressStreet1,
    addressStreet2,
    addressCity,
    addressRegion,
    addressZip
  } = req.body
  //destructure from req. body.
  const bcryptHashedPw = await bcrypt.hash(password,10)
  const result = await prisma.user.create({
    // create must need data:{data here}
    data: {
      firstName,
      lastName,
      email,
      phone,
      hashedPassword:bcryptHashedPw,
      addressStreet1,
      addressStreet2,
      addressCity,
      addressRegion,
      addressZip
     },
  })
  delete result.hashedPassword
  //delete hashedPassword and send the json to frontend.
  res.json(result)
})
///sign up/////////////////////
// {    "firstName":"peter",
//     "lastName":"kang",
//     "email":"peter5@peter.com",
//     "phone":123456,
//     "password":"123123",
//     "addressStreet1":"123123",
//     "addressStreet2":"123123",
//     "addressCity":"123123",
//     "addressRegion":"123123",
//     "addressZip":123123}

//Log in
router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  const {email, password} = req.body
  const user = await prisma.user.findUnique({
    where:{
      email:email
    }
  })

  if (!user) {
    let err = new HttpException(401, 'Email does not exist', ['User not found'], 'User not found')

    console.log(err)
    next(err)
  }
})

//Get User's information
router.get("/:id(\\d+)", async (req: Request, res: Response) => {
  const userId = Number(req.params.id)
  const user = await prisma.user.findUnique({
    where:{
      id:userId
    }
  })
  delete user.hashedPassword
  res.json(user)
})


module.exports = router
