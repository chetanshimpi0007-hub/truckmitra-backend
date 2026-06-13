// // src/components/auth/ForgotPasswordForm.tsx
// import React, { useState } from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Alert,
//   CircularProgress,
//   InputAdornment,
// } from '@mui/material';
// import { Phone, Lock } from '@mui/icons-material';
// import { useForm, Controller } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

// const phoneSchema = z.object({
//   mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
// });

// const otpSchema = z.object({
//   otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
//   newPassword: z.string().min(6, 'Password must be at least 6 characters'),
//   confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
// }).refine((data) => data.newPassword === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

// type PhoneForm = z.infer<typeof phoneSchema>;
// type ResetForm = z.infer<typeof otpSchema>;

// interface ForgotPasswordFormProps {
//   onSendOtp: (mobile: string) => void;
//   onResetPassword: (data: { mobile: string; otp: string; newPassword: string }) => void;
//   isLoading?: boolean;
//   otpSent?: boolean;
//   tempMobile?: string | null;
// }

// export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
//   onSendOtp,
//   onResetPassword,
//   isLoading = false,
//   otpSent = false,
//   tempMobile,
// }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const {
//     control: controlPhone,
//     handleSubmit: handlePhoneSubmit,
//     formState: { errors: phoneErrors },
//   } = useForm<PhoneForm>({
//     resolver: zodResolver(phoneSchema),
//     defaultValues: { mobile: '' }
//   });

//   const {
//     control: controlReset,
//     handleSubmit: handleResetSubmit,
//     formState: { errors: resetErrors },
//   } = useForm<ResetForm>({
//     resolver: zodResolver(otpSchema),
//     defaultValues: { otp: '', newPassword: '', confirmPassword: '' }
//   });

//   const onPhoneFormSubmit = (data: PhoneForm) => {
//     onSendOtp(data.mobile);
//   };

//   const onResetFormSubmit = (data: ResetForm) => {
//     if (tempMobile) {
//       onResetPassword({
//         mobile: tempMobile,
//         otp: data.otp,
//         newPassword: data.newPassword,
//       });
//     }
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
//       <Box sx={{ textAlign: 'center', mb: 3 }}>
//         <img src="/logo.png" alt="TruckMitra" style={{ height: 48 }} />
//         <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
//           Reset Password
//         </Typography>
//       </Box>

//       {!otpSent ? (
//         <form onSubmit={handlePhoneSubmit(onPhoneFormSubmit)}>
//           <Controller
//             name="mobile"
//             control={controlPhone}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 fullWidth
//                 label="Mobile Number"
//                 placeholder="10 digit mobile number"
//                 error={!!phoneErrors.mobile}
//                 helperText={phoneErrors.mobile?.message}
//                 margin="normal"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Phone />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             )}
//           />

//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             disabled={isLoading}
//             sx={{ mt: 2 }}
//           >
//             {isLoading ? <CircularProgress size={24} /> : 'Send OTP'}
//           </Button>
//         </form>
//       ) : (
//         <form onSubmit={handleResetSubmit(onResetFormSubmit)}>
//           <Alert severity="info" sx={{ mb: 2 }}>
//             OTP sent to {tempMobile}
//           </Alert>

//           <Controller
//             name="otp"
//             control={controlReset}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 fullWidth
//                 label="Enter OTP"
//                 placeholder="6 digit OTP"
//                 error={!!resetErrors.otp}
//                 helperText={resetErrors.otp?.message}
//                 margin="normal"
//               />
//             )}
//           />

//           <Controller
//             name="newPassword"
//             control={controlReset}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 fullWidth
//                 label="New Password"
//                 type={showPassword ? 'text' : 'password'}
//                 error={!!resetErrors.newPassword}
//                 helperText={resetErrors.newPassword?.message}
//                 margin="normal"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Lock />
//                     </InputAdornment>
//                   ),
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <Button
//                         onClick={() => setShowPassword(!showPassword)}
//                         size="small"
//                       >
//                         {showPassword ? 'Hide' : 'Show'}
//                       </Button>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             )}
//           />

//           <Controller
//             name="confirmPassword"
//             control={controlReset}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 fullWidth
//                 label="Confirm Password"
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 error={!!resetErrors.confirmPassword}
//                 helperText={resetErrors.confirmPassword?.message}
//                 margin="normal"
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Lock />
//                     </InputAdornment>
//                   ),
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <Button
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         size="small"
//                       >
//                         {showConfirmPassword ? 'Hide' : 'Show'}
//                       </Button>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             )}
//           />

//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             disabled={isLoading}
//             sx={{ mt: 2 }}
//           >
//             {isLoading ? <CircularProgress size={24} /> : 'Reset Password'}
//           </Button>
//         </form>
//       )}
//     </Paper>
//   );
// };
import React from 'react'

function ForgotPasswordForm() {
  return (
    <div>ForgotPasswordForm</div>
  )
}

export default ForgotPasswordForm