import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/userModel";

export const inngest = new Inngest({ id: "quickcart-next" });

export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk"
  },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url
    };
    console.log("syncUserCreation");

    await connectDB();
    const newUser = new User(userData);
    await newUser.save();
  }
);
export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk"
  },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      imageUrl: image_url
    };

    console.log("syncUserUpdation");
    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk"
  },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    console.log("syncUserDeletion");
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);
