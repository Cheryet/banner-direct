'use client';

import * as React from 'react';
import { ArrowRight, User, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmailInput } from './email-input';
import { PasswordInput } from './password-input';
import { AuthSubmitButton } from './auth-submit-button';
import { AuthFeedback } from './auth-feedback';
import { cn } from '@/lib/utils';

/**
 * SignupForm - Account creation form
 * Collects name, email, phone, and password
 */
function SignupForm({
  onSubmit,
  isLoading = false,
  error,
  submitText = 'Create Account',
  className,
}) {
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState({});

  const validate = () => {
    const errors = {};

    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit({
      email,
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      {error && <AuthFeedback variant="error" message={error} />}

      {/* Name fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First Name</Label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <Input
              id="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isLoading}
              aria-invalid={!!fieldErrors.firstName}
              className={cn('pl-10', fieldErrors.firstName && 'border-red-300')}
              required
            />
          </div>
          {fieldErrors.firstName && <p className="text-sm text-red-600">{fieldErrors.firstName}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Smith"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={isLoading}
            aria-invalid={!!fieldErrors.lastName}
            className={fieldErrors.lastName ? 'border-red-300' : ''}
            required
          />
          {fieldErrors.lastName && <p className="text-sm text-red-600">{fieldErrors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <EmailInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Phone
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isLoading}
            aria-invalid={!!fieldErrors.phone}
            className={cn('pl-10', fieldErrors.phone && 'border-red-300')}
            required
          />
        </div>
        {fieldErrors.phone && <p className="text-sm text-red-600">{fieldErrors.phone}</p>}
      </div>

      {/* Password */}
      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        hint="Must be at least 8 characters"
        error={fieldErrors.password}
        required
        disabled={isLoading}
      />

      <AuthSubmitButton isLoading={isLoading} loadingText="Creating account...">
        <span>{submitText}</span>
        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
      </AuthSubmitButton>
    </form>
  );
}

export { SignupForm };
