import React, { useEffect, useRef } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, length = 6, disabled = false }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, val: string) => {
    // Only allow digits
    if (!/^\d*$/.test(val)) return;

    // Keep only the last digit if multiple characters pasted
    const digit = val.slice(-1);

    const newValue = value.split('');
    newValue[index] = digit;
    const newOtp = newValue.join('');

    onChange(newOtp);

    // Auto focus to next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (value[index]) {
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, length);
    
    if (digits.length > 0) {
      const newValue = digits.join('');
      onChange(newValue);
      
      // Focus on the last filled input or the input after the last digit
      const focusIndex = Math.min(digits.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3 sm:gap-4">
      {Array.from({ length }).map((_, index) => (
        <input key={index} ref={(el) => {   inputRefs.current[index] = el; }} type="text" inputMode="numeric" maxLength={1} value={value[index] || ''} onChange={(e) => handleChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} onPaste={handlePaste} disabled={disabled} className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl border-2 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
      ))}
    </div>
  );
};

export default OtpInput;
