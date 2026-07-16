import React from 'react';
import { AssetsMenu } from './AssetsMenu';
import { RelationshipsMenu } from './RelationshipsMenu';

export function PhaseTwoAssetsMenu(props) {
  return (
    <div className="phase-two-screen-host phase-two-assets-host">
      <AssetsMenu {...props} />
    </div>
  );
}

export function PhaseTwoRelationshipsMenu(props) {
  return (
    <div className="phase-two-screen-host phase-two-relationships-host">
      <RelationshipsMenu {...props} />
    </div>
  );
}
