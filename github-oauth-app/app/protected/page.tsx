"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert,
} from "@mui/material"
import { ExitToApp, Lock, GitHub, Email } from "@mui/icons-material"
import Link from "next/link"

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (status === "unauthenticated") {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          You must be signed in to view this page.
        </Alert>
      </Container>
    )
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "github":
        return <GitHub />
      case "google":
        return <Email />
      default:
        return <GitHub />
    }
  }

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "github":
        return "GitHub"
      case "google":
        return "Google"
      default:
        return "Unknown"
    }
  }

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "secondary.main" }}>
        <Toolbar>
          <Lock sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard - Protected
          </Typography>
          <Button color="inherit" component={Link} href="/public">
            Public Page
          </Button>
          {session && (
            <Button color="inherit" startIcon={<ExitToApp />} onClick={() => signOut()} sx={{ ml: 2 }}>
              Sign Out
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info" sx={{ mb: 4 }}>
          <Typography variant="body2">
            🔒 This is a protected page. Only authenticated users can access this content.
          </Typography>
        </Alert>

        {session?.user && (
          <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <Avatar src={session.user.image || ""} alt={session.user.name || ""} sx={{ width: 120, height: 120 }} />
              <Box>
                <Typography variant="h3" component="h1" gutterBottom>
                  {session.user.name}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {session.user.email}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mt: 2 }}>
                  <Chip label="Authenticated User" color="success" />
                  {session.provider && (
                    <Chip
                      icon={getProviderIcon(session.provider)}
                      label={`${getProviderName(session.provider)} Account`}
                      color="primary"
                    />
                  )}
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Protected Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Welcome to the secure area! This page is only accessible to authenticated users.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You have successfully logged in using your {session.provider && getProviderName(session.provider)}{" "}
                account. This demonstrates secure authentication and protected route functionality.
              </Typography>
            </Box>
          </Paper>
        )}
      </Container>
    </>
  )
}
