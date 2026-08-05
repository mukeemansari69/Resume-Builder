const INTERVIEW_BASE_URL = '/api/interview'

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Unable to generate interview report.')
  }

  return data
}

export async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const formData = new FormData()
  formData.append('resume', resume)
  formData.append('selfDescription', selfDescription.trim())
  formData.append('jobDescription', jobDescription.trim())

  const response = await fetch(INTERVIEW_BASE_URL, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  return parseResponse(response)
}
