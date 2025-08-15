import { NhostClient } from '@nhost/nhost-js'

const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN || 'thunpfudsbublhllnhrt'
const region = import.meta.env.VITE_NHOST_REGION || 'ap-south-1'

export const nhost = new NhostClient({
  subdomain,
  region,
})
