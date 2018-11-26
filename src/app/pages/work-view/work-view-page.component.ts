import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../../tasks/task.service';
import { expandFadeAnimation } from '../../ui/animations/expand.ani';
import { LayoutService } from '../../core/layout/layout.service';
import { DragulaService } from 'ng2-dragula';
import { TakeABreakService } from '../../time-tracking/take-a-break/take-a-break.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskWithSubTasks } from '../../tasks/task.model';
import { Actions } from '@ngrx/effects';

@Component({
  selector: 'work-view',
  templateUrl: './work-view-page.component.html',
  styleUrls: ['./work-view-page.component.scss'],
  animations: [expandFadeAnimation]
})
export class WorkViewPageComponent implements OnInit, OnDestroy {
  isVertical = false;
  isHideControls: boolean;
  workedWithoutABreak = '-';
  isShowTimeWorkedWithoutBreak = true;

  // TODO
  isPlanYourDay = false; // = first start in day or no todays tasks at all (session needed)
  // close when starting a task
  isShowBacklog = false; // if isPlanYourDay and  show only if there are actually some
  splitInputPos = 0;

  // we do it here to have the tasks in memory all the time
  backlogTasks: TaskWithSubTasks[];

  isTriggerSwitchListAni = false;

  private _subs = new Subscription();
  private _switchListAnimationTimeout: number;

  constructor(
    public taskService: TaskService,
    public takeABreakService: TakeABreakService,
    private _layoutService: LayoutService,
    private _dragulaService: DragulaService,
    private _activatedRoute: ActivatedRoute,
    private _actions$: Actions,
    private _cd: ChangeDetectorRef,
  ) {
    // this.focusTaskIdList$.subscribe(v => console.log(v));
  }

  @HostListener('blur', ['$event']) onBlur(ev: Event) {
    console.log('BLUR', ev);
  }

  ngOnInit() {
    if (this.isShowBacklog) {
      this.splitInputPos = 50;
    } else {
      this.splitInputPos = 100;
    }

    this._subs.add(this.taskService.backlogTasks$.subscribe(tasks => this.backlogTasks = tasks));
    this._subs.add(this.taskService.onTaskSwitchList$.subscribe(() => this._triggerTaskSwitchListAnimation()));

    this._dragulaService.createGroup('PARENT', {
      direction: 'vertical',
      moves: function (el, container, handle) {
        // console.log('moves par', handle.className, handle.className.indexOf('handle-par') > -1);
        return handle.className.indexOf && handle.className.indexOf('handle-par') > -1;
      }
    });

    this._dragulaService.createGroup('SUB', {
      direction: 'vertical',
      moves: function (el, container, handle) {
        // console.log('moves sub', handle.className, handle.className.indexOf('handle-sub') > -1);
        return handle.className.indexOf && handle.className.indexOf('handle-sub') > -1;
      }
    });

    this._activatedRoute.queryParams
      .subscribe((params) => {
        if (params && params.backlogPos) {
          this.splitInputPos = params.backlogPos;
        }
      });
  }


  ngOnDestroy() {
    this._dragulaService.destroy('PARENT');
    this._dragulaService.destroy('SUB');
    if (this._switchListAnimationTimeout) {
      window.clearTimeout(this._switchListAnimationTimeout);
    }
  }

  showAddTaskBar() {
    this._layoutService.showAddTaskBar();
  }


  collapseAllNotesAndSubTasks() {
  }

  private _triggerTaskSwitchListAnimation() {
    this.isTriggerSwitchListAni = true;
    this._cd.detectChanges();
    this._switchListAnimationTimeout = window.setTimeout(() => {
      this.isTriggerSwitchListAni = false;
      this._cd.detectChanges();
    }, 300);
  }
}
