import mongoose, { Schema, models } from "mongoose"

const contractSchema = new Schema({
  companyName: { type: String },
  rate: { type: Number },
  logo: { type: String },
  companyType: { type: String },
})

const adminSchema = new Schema({
  isAdmin: { type: String },
  company: { type: String },
})

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "Sales2",
    },
    admin: {
      type: [adminSchema],
      default: [
        {
          isAdmin: false,
          company: "none",
        },
      ],
    },
    avatar: {
      type: String,
      default: "/user.png",
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
    },
    upSeller: {
      type: String,
      default: "none",
    },
    upSellerId: {
      type: String,
      default: "none",
    },
    upsellerPercentage: {
      type: String,
      default: null,
    },
    contracts: {
      type: [contractSchema],
      default: [
        {
          companyName: "WordSphere",
          rate: 20,
          logo: "/wordsphere.png",
          companyType: "Web Development Agency",
        },
        {
          companyName: "image appeal",
          rate: 20,
          logo: "/ia.png",
          companyType: "Graphics Design Agency",
        },
      ],
    },
  },
  { timestamps: true }
)

const User = models.User || mongoose.model("User", userSchema)

export default User
