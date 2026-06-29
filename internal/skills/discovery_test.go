package skills

import (
	"os"
	"path/filepath"
	"reflect"
	"testing"
)

func TestInstalledReturnsSortedDirectoriesOnly(t *testing.T) {
	tempDir := t.TempDir()

	if err := os.Mkdir(filepath.Join(tempDir, "z-skill"), 0o755); err != nil {
		t.Fatalf("create z-skill dir: %v", err)
	}
	if err := os.Mkdir(filepath.Join(tempDir, "a-skill"), 0o755); err != nil {
		t.Fatalf("create a-skill dir: %v", err)
	}
	if err := os.WriteFile(filepath.Join(tempDir, "README.txt"), []byte("ignored"), 0o644); err != nil {
		t.Fatalf("create file: %v", err)
	}

	got, err := Installed(tempDir)
	if err != nil {
		t.Fatalf("Installed returned error: %v", err)
	}

	want := []string{"a-skill", "z-skill"}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("Installed() = %v, want %v", got, want)
	}
}

func TestInstalledReturnsEmptySliceWhenDirectoryDoesNotExist(t *testing.T) {
	missingDir := filepath.Join(t.TempDir(), "missing")

	got, err := Installed(missingDir)
	if err != nil {
		t.Fatalf("Installed returned error for missing dir: %v", err)
	}
	if len(got) != 0 {
		t.Fatalf("Installed() for missing dir = %v, want empty", got)
	}
}
