import {useSupabase} from 'boot/supabase'

export const useAuth = () => {
  const {supabase} = useSupabase()

  /**
   * Register a new user account
   * @param {string} email
   * @param {string} password
   * @param {string} name
   * @returns {Promise<{data: {user: ?User, session: ?Session}, error: ?AuthError}>}
   */
  const register = async (email, password, name) => {
    return await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/#/login?`,
          data: {name}
        }
      }
    )
  }

  /**
   * Login with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{data: {user: ?User, session: ?Session}, error: ?AuthError}>}
   */
  const signInWithEmail = async (email, password) => {
    return await supabase.auth.signInWithPassword({email, password})
  }

  /**
   * Logout user removing the browser session and any objects from localStorage
   * @returns {Promise<{data: null, error: ?AuthError}>}
   */
  const signOut = async () => {
    return await supabase.auth.signOut()
  }

  /**
   * Send email to recover user access to application
   * @param {string} email
   * @returns {Promise<{data: {}, error: null}|{data: null, error: AuthError}>}
   */
  const sendPasswordRestEmail = async (email) => {
    return await supabase.auth.resetPasswordForEmail(email, {redirectTo: `${window.location.origin}/#/login?`})
  }

  /**
   * Change the user password, it is necessary to be authenticated
   * @param newPassword
   * @returns {Promise<{data: {user: User}, error: null}|{data: {user: null}, error: AuthError}>}
   */
  const changePassword = async (newPassword) => {
    return await supabase.auth.updateUser({password: newPassword})
  }

  const updateUser = async (email, name) => {
    return await supabase.auth.updateUser({email: email, data: {name}})
  }

  return {
    register,
    signInWithEmail,
    signOut,
    sendPasswordRestEmail,
    changePassword,
    updateUser
  }
}
