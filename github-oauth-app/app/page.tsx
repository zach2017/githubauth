"use client"

import { signIn, useSession } from "next-auth/react"
import { Container, Typography, Button, Box, Paper, Stack } from "@mui/material"
import { GitHub, Email } from "@mui/icons-material"
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
            OAuth Login
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Sign in with your preferred account to continue
          </Typography>

          <Stack spacing={3} sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<GitHub />}
              onClick={() => signIn("github")}
              sx={{
                py: 1.5,
                px: 4,
                bgcolor: "#24292e",
                "&:hover": {
                  bgcolor: "#1a1e22",
                },
              }}
            >
              Login with GitHub
            </Button>

            <Button
              variant="contained"
              size="large"
              startIcon={<Email />}
              onClick={() => signIn("google")}
              sx={{
                py: 1.5,
                px: 4,
                bgcolor: "#db4437",
                "&:hover": {
                  bgcolor: "#c23321",
                },
              }}
            >
              Login with Gmail
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  )
}
