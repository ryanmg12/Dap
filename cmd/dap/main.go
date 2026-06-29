package main

import (
	"fmt"
	"log"

	"dap/internal/skills"
)

func main() {
	skillsDir, err := skills.DefaultSkillsDir()
	if err != nil {
		log.Fatalf("resolve skills dir: %v", err)
	}

	installed, err := skills.Installed(skillsDir)
	if err != nil {
		log.Fatalf("discover installed skills: %v", err)
	}

	fmt.Printf("Copilot skills directory: %s\n", skillsDir)
	fmt.Printf("Installed skills (%d):\n", len(installed))
	for _, name := range installed {
		fmt.Printf("- %s\n", name)
	}
}
