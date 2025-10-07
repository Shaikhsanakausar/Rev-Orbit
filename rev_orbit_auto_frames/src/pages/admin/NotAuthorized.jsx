import React from 'react';

export default function NotAuthorized() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="bg-muted/50 p-10 rounded-2xl shadow-lg border border-border text-center max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-primary drop-shadow">Not Authorized</h2>
        <p className="mb-6 text-lg text-foreground">You do not have permission to access the admin panel.</p>
      </div>
    </div>
  );
}
