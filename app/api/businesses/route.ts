import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { businessFormSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = businessFormSchema.parse(body)

    const supabase = await createClient()

    // Create the business
    const { data: business, error } = await supabase
      .from('businesses')
      .insert({
        ...validatedData,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ 
      success: true, 
      business: {
        id: business.id,
        name: business.name,
        description: business.description,
      }
    })

  } catch (error) {
    console.error('Error creating business:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
