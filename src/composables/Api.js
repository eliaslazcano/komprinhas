import {useSupabase} from 'src/boot/supabase'
import {useSessionStore} from 'src/stores/session'

export const useApi = () => {
  const {supabase} = useSupabase()
  const user_id = useSessionStore().user?.id || null

  /**
   * Return all data/rows from table
   * @param {string} table
   */
  const list = async (table) => {
    return await supabase.from(table).select();
  }

  /**
   * Get data from specific row by primary key ID
   * @param {string} table
   * @param {number} id
   */
  const getById = (table, id) => {
    return supabase.from(table).select('*').eq('id', id);
  }

  /**
   * Insert data in table
   * @param {string} table
   * @param {Object} data
   */
  const post = (table, data) => {
    return supabase.from(table).insert({ ...data, user_id })
  }

  /**
   * Update row from table
   * @param {string} table
   * @param {Object} data
   */
  const update = (table, data) => {
    return supabase.from(table).update({ ...data, user_id }).eq('id', data.id)
  }

  /**
   * Delete row from table
   * @param {string} table
   * @param {number} id
   */
  const remove = (table, id) => {
    return supabase.from(table).delete().eq('id', id)
  }

  return {list, getById, post, update, remove}
}
