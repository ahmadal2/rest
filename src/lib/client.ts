// rc/lib/client.ts

export class ApiClient {
  projectId: string
  apiBaseUrl: string
  authOrigin: string

  constructor(config: { projectId: string; apiBaseUrl: string; authOrigin: string }) {
    this.projectId = config.projectId
    this.apiBaseUrl = config.apiBaseUrl
    this.authOrigin = config.authOrigin
  }

  // Beispiel: Methode, um Nutzerdaten abzurufen
  async getCurrentUser() {
    // Hier würdest du echte API-Aufrufe machen, z.B. fetch
    // Aktuell nur Dummy-Daten
    return { id: '123', name: 'Max Mustermann' }
  }

  // Beispiel: Login-Methode
  async login() {
    // Hier könntest du Redirect oder Auth-Flow starten
    console.log(`Login starten über ${this.authOrigin}`)
  }
}

// Instanz erstellen
export const apiClient = new ApiClient({
  projectId: 'p357664148769689600',
  apiBaseUrl: 'https://api.example.com',
  authOrigin: 'https://auth.example.com',
})
