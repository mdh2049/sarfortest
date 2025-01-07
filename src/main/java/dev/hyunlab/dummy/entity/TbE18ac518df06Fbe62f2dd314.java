package dev.hyunlab.dummy.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.Comment;
import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_e18ac518df06_fbe62f2dd314")
public class TbE18ac518df06Fbe62f2dd314 {
  @Id
  @GenericGenerator(name = "id_gen", strategy = "dev.hyunlab.gravity.cmmn.misc.GcIdGenerator")
  @GeneratedValue(generator = "id_gen")
  @Column(name = "pk_fbe62f2dd314")
  private String pkFbe62f2dd314;

  @Column(name="col_mdfcn_dt")
  private LocalDateTime colMdfcnDt;

  @Column(name = "a9480a0be018")
@Comment("가격")
private String a9480a0be018;

@Column(name = "a9cbd6338b24")
@Comment("상품")
private String a9cbd6338b24;

@Column(name = "ec9013607471")
@Comment("사용자")
private String ec9013607471;

@Column(name = "f49d7f97577a")
@Comment("구매일")
private String f49d7f97577a;


}