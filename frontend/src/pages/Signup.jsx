import { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { handleSignup, isAuthenticated } from '../utils/auth';

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      contact: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      contact: Yup.string().matches(/^[0-9]{10}$/, 'Contact must be a valid 10-digit phone number'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      await handleSignup(values, setSubmitting, navigate);
    }
  })


  return (
    <div className='min-h-screen pb-[7%] pt-[7%] flex item-center justify-center bg-slate-100 p-4'>
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Create an Account</h2>
        <p className="text-sm text-center text-slate-500 mb-6">Manage your daily tasks efficiently</p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formik.touched.name && formik.errors.name
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-slate-300 focus:ring-blue-200'
                }`}
              {...formik.getFieldProps('name')}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formik.touched.email && formik.errors.email
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-slate-300 focus:ring-blue-200'
                }`}
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formik.touched.password && formik.errors.password
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-slate-300 focus:ring-blue-200'
                }`}
              {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Contact Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number (Optional)</label>
            <input
              type="text"
              name="contact"
              placeholder="9876543210"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${formik.touched.contact && formik.errors.contact
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-slate-300 focus:ring-blue-200'
                }`}
              {...formik.getFieldProps('contact')}
            />
            {formik.touched.contact && formik.errors.contact && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.contact}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-center text-slate-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
};

export default Signup;
