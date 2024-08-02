import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  first_name: String | null;
  last_name: String | null;
  email: String | null;
}

const initialState: UserState = {
   first_name: null,
   last_name: null,
   email: null
}

export const userSlice = createSlice({
   name: 'user',
   initialState,
   reducers: {
      setUser: (state, action: PayloadAction<UserState>) => {
         state.first_name = action.payload.first_name
         state.last_name = action.payload.last_name
         state.email = action.payload.email
      },
      clearUser: (state) => {
         state.first_name = null
         state.last_name = null
         state.email = null
      }
   },
})

export const { setUser, clearUser } = userSlice.actions

export default userSlice.reducer