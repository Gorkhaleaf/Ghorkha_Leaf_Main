'use client';

import { useState } from 'react';
import './AuthModal.css';
import { createClient } from '@/lib/supabase/client';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess?: () => void;
}

const AuthModal = ({ onClose, onAuthSuccess }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const supabase = createClient();

  const normalizePhone = (p: string) => {
    try {
      return String(p).replace(/\D/g, '');
    } catch {
      return p;
    }
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        // Create account
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // If user object returned immediately, upsert profile with phone
        const user = (data as any)?.user ?? null;
        if (user && user.id) {
          try {
            await supabase
              .from('profiles')
              .upsert({
                id: user.id,
                email,
                phone,
                phone_normalized: normalizePhone(phone)
              });
          } catch (pfErr) {
            console.warn('[AuthModal] failed to upsert profile with phone', pfErr);
          }
        } else {
          // For magic-link flows user may not be available until confirmation.
          // Optionally, you can persist phone in a temporary store and run a server-side job to attach after confirmation.
        }

        setMessage('User Successfully registered-- You can sign in now!');
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage('Logged in successfully!');
        if (onAuthSuccess) onAuthSuccess();
        setTimeout(onClose, 1500);
      }
    } catch (error: any) {
      setMessage(error?.message ?? String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-left-panel">
          <img src="/darjeeling-500x500.jpg" alt="Mountain Landscape" />
        </div>
        <div className="auth-modal-right-panel">
          <button className="close-button" onClick={onClose}>&times;</button>
          <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{isSignUp ? 'Join us and start your journey.' : 'Sign in to continue.'}</p>
          <form onSubmit={handleAuthAction}>
            <div className="input-group">
              <i className="icon user-icon"></i>
              <input
                type="email"
                placeholder="Email"
                value={email || ''}
                onChange={(e) => setEmail(e.target.value || '')}
                required
              />
            </div>

            <div className="input-group">
              <i className="icon phone-icon"></i>
              <input
                type="tel"
                placeholder={isSignUp ? "Phone (required)" : "Phone (required)"}
                value={phone || ''}
                onChange={(e) => setPhone(e.target.value || '')}
                required={isSignUp}
              />
            </div>

            <div className="input-group">
              <i className="icon lock-icon"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password || ''}
                onChange={(e) => setPassword(e.target.value || '')}
                required
              />
              <i
                className={`icon eye-icon ${showPassword ? 'visible' : ''}`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit" className="action-button" disabled={loading}>
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <div className="toggle-auth">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <a href="#" onClick={() => setIsSignUp(false)}>
                  Sign In
                </a>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <a href="#" onClick={() => setIsSignUp(true)}>
                  Register
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;