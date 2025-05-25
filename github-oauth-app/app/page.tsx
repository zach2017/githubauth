"use client"

import { signIn, useSession } from "next-auth/react"
import { Container, Typography, Button, Box, Paper } from "@mui/material"
import { GitHub } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/protected")
    }
  }, [session, router])

  if (status === "loading") {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Typography variant="h4">Loading...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h3" component="h1" gutterBottom>
            GitHub OAuth Login
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Sign in with your GitHub account to continue
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<GitHub />}
            onClick={() => signIn("github")}
            sx={{ mt: 2, py: 1.5, px: 4 }}
          >
            Login with GitHub
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}
