# Codex

This repository contains a sample .NET Aspire project targeting **.NET 9**. The structure was created without the `dotnet` CLI so you may need to adjust it to your environment.

## Structure

- `Directory.Build.props` &mdash; sets the default target framework to `net9.0` for all projects.
- `src/Codex.AppHost` &mdash; console host referencing the web project.
- `src/Codex.Web` &mdash; minimal ASP.NET Core web application.

## Building

Install a .NET 9 SDK and run:

```bash
dotnet build Codex.sln
```

## Running

```bash
dotnet run --project src/Codex.Web/Codex.Web.csproj
```
