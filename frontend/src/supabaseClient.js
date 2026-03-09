import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yaxxhdbpmjgjzuavtwhr.supabase.co";
const supabaseAnonKey = "sb_publishable_Tq_1FYs_4w0VfjvtHYthYg_uuwdMa9y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
