// export function adminAuth(req, res, next) {
//   const secret = req.headers["x-admin-secret"];

//   if (!secret || secret !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
//     return res.status(401).json({
//       error: "Unauthorized admin access",
//     });
//   }

//   next();
// }
// Is this place my password exists? 

export default function admin(req, res, next) {
  next();
}

