"use client"

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  CircularProgress,
} from "@mui/material"
import { GitHub, ExitToApp } from "@mui/icons-material"
import Link from "next/link"

interface Repository {
  id: number
  name: string
  description: string
  html_url: string
  language: string
  stargazers_count: number
  forks_count: number
}

export default function PublicPage() {
  const { data: session, status } = useSession()
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchRepos()
    }
  }, [session])

  const fetchRepos = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${session?.user?.name}/repos?sort=updated&per_page=10`)

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const data = await response.json()

      // Ensure data is an array
      if (Array.isArray(data)) {
        setRepos(data)
      } else {
        console.error("GitHub API did not return an array:", data)
        setRepos([])
      }
    } catch (error) {
      console.error("Error fetching repos:", error)
      setRepos([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <GitHub sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GitHub Dashboard - Public
          </Typography>
          <Button color="inherit" component={Link} href="/protected">
            Protected Page
          </Button>
          {session && (
            <Button color="inherit" startIcon={<ExitToApp />} onClick={() => signOut()} sx={{ ml: 2 }}>
              Sign Out
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {session?.user && (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                src={session.user.image || ""}
                alt={session.user.name || ""}
                sx={{ width: 80, height: 80, mr: 3 }}
              />
              <Box>
                <Typography variant="h4" component="h1">
                  {session.user.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {session.user.email}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        <Paper elevation={3}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Recent Repositories
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
              </Box>
            ) : repos.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Language</TableCell>
                      <TableCell align="center">Stars</TableCell>
                      <TableCell align="center">Forks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {repos.map((repo) => (
                      <TableRow key={repo.id}>
                        <TableCell>
                          <Button
                            component="a"
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="text"
                          >
                            {repo.name}
                          </Button>
                        </TableCell>
                        <TableCell>{repo.description || "No description"}</TableCell>
                        <TableCell>{repo.language && <Chip label={repo.language} size="small" />}</TableCell>
                        <TableCell align="center">{repo.stargazers_count}</TableCell>
                        <TableCell align="center">{repo.forks_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: "center", p: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No repositories found.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  )
}
