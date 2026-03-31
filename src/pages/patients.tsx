import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/lib/supabase'
import { ROUTES } from '@/routes/paths'

interface IPatientProfile {
  id: string
  firstName: string
  lastName: string
  createdAt: string
}

export const PatientsPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [patients, setPatients] = React.useState<IPatientProfile[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          navigate(ROUTES.LOGIN)
          return
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/patients`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.status === 401) {
          navigate(ROUTES.LOGIN)
          return
        }

        if (!response.ok) {
          throw new Error(t('errors.fetchFailed'))
        }

        const json = await response.json()
        setPatients(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : t('errors.unknown'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatients()
  }, [navigate, t])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t('patients.title')}</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {patients.length === 0 && !error ? (
        <p className="text-muted-foreground">{t('patients.empty')}</p>
      ) : (
        <div className="grid gap-4">
          {patients.map((patient) => (
            <Card
              key={patient.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(ROUTES.PATIENT_DETAIL(patient.id))}
            >
              <CardHeader>
                <CardTitle>
                  {patient.firstName} {patient.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('patients.createdAt')}:{' '}
                  {new Date(patient.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
