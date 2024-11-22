import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { IssuePanelIntroComponent } from './issue-panel-intro/issue-panel-intro.component';
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { IssueModule } from '../issue/issue.module';
import { MatTooltip } from '@angular/material/tooltip';
import { IssueProviderTabComponent } from './issue-provider-tab/issue-provider-tab.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { selectIssueProvidersWithDisabledLast } from '../issue/store/issue-provider.selectors';
import { IssueProvider } from '../issue/issue.model';
import {
  getIssueProviderInitials,
  getIssueProviderTooltip,
} from '../issue/get-issue-provider-tooltip';
import { MatDialog } from '@angular/material/dialog';

import { UiModule } from '../../ui/ui.module';
import { T } from '../../t.const';
import { DialogEditIssueProviderComponent } from '../issue/dialog-edit-issue-provider/dialog-edit-issue-provider.component';
import { IssueProviderSetupOverviewComponent } from './issue-provider-setup-overview/issue-provider-setup-overview.component';
import { WorkContextService } from '../work-context/work-context.service';

@Component({
  selector: 'issue-panel',
  standalone: true,
  imports: [
    UiModule,
    IssuePanelIntroComponent,
    MatTabGroup,
    MatTab,
    MatTabLabel,
    MatIcon,
    IssueModule,
    MatTooltip,
    IssueProviderTabComponent,
    MatTabContent,
    IssueProviderSetupOverviewComponent,
  ],
  templateUrl: './issue-panel.component.html',
  styleUrl: './issue-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssuePanelComponent {
  readonly T = T;

  private _store = inject(Store);
  private _matDialog = inject(MatDialog);
  private _workContextService = inject(WorkContextService);

  selectedTabIndex = signal(0);
  isShowIntro = signal(false);
  issueProviders = toSignal(this._store.select(selectIssueProvidersWithDisabledLast));

  constructor() {
    this._setSelectedTabIndex();
  }

  getToolTipText(issueProvider: IssueProvider): string {
    return getIssueProviderTooltip(issueProvider);
  }

  getIssueProviderInitials(issueProvider: IssueProvider): string | null | undefined {
    return getIssueProviderInitials(issueProvider);
  }

  openEditIssueProvider(issueProvider: IssueProvider): void {
    this._matDialog.open(DialogEditIssueProviderComponent, {
      restoreFocus: true,
      data: {
        issueProvider,
      },
    });
  }

  private _setSelectedTabIndex(): void {
    const providers = this.issueProviders();
    const index = providers?.findIndex(
      (provider) =>
        provider.defaultProjectId === this._workContextService.activeWorkContextId,
    );
    if (index) {
      this.selectedTabIndex.set(index !== -1 ? index : 0);
    }
  }
}
