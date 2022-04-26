import React, {ChangeEvent, useState} from "react";
import {FormControl, IconButton, InputAdornment, OutlinedInput} from "@material-ui/core";
import Label from "../../../components/general/label";
import {Visibility, VisibilityOff} from "@material-ui/icons";

const inputStyle = { WebkitBoxShadow: "0 0 0 1000px white inset" };

interface CustomInputTextProps {
    type: string,
    label: string,
    value: string,
    placeholder?: string,
    className?: string,
    showIcon?: boolean,
    autoFocus?: boolean,
    onChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) : void,
    onBlur?(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) : void,
}

export const CustomInputText = ({ type = 'text',
                                  label,
                                  value,
                                  placeholder = '',
                                  className = '',
                                  showIcon = false,
                                  autoFocus = false,
                                  onChange,
                                  onBlur} : CustomInputTextProps) => {

  const [showPass, setShowPass] = useState(false);

  return (
      <FormControl variant="outlined" className={className}>
          <Label text={label} />
          <OutlinedInput
              type={!showIcon ? type : showPass ? 'text' : 'password'}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              inputProps={{style: inputStyle}}
              {...(showIcon ? {
                      endAdornment:
                          <InputAdornment position="end">
                              <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => setShowPass((prev) => !prev)}
                                  edge="end"
                                  tabIndex={-1}
                              >
                                  {showPass ? <VisibilityOff/> : <Visibility/>}
                              </IconButton>
                          </InputAdornment>

              } : {})}
              autoFocus={autoFocus}
              autoComplete='off'
          />
      </FormControl>
  );
}

export default CustomInputText;