import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const contractorId = searchParams.get('contractorId')
  const requestId = Number(searchParams.get('requestId'))

  if (!contractorId || Number.isNaN(requestId)) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('Assigned_Leads')
    .select('*')
    .eq('contractor_id', contractorId)
    .eq('request_id', requestId)
    .order('Assigned Date', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}


